import { db } from "@/db";
import { cashflow } from "@/db/schema";
import { and, gte, lte } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import ExcelJs from "exceljs";
import { formatDate } from "@/lib/utils";
import { auth } from "@/auth";

export async function GET(request: NextRequest){
    const session = await auth();
    if(!session) {
        return NextResponse.json({error: "Unauthorized"}, { status: 401 });
    }
    try {
        const now = new Date();
        // Allow overriding month via query param `month=YYYY-MM`
        const monthParam = request.nextUrl.searchParams.get('month');
        let startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        let endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        if (monthParam) {
          const parts = monthParam.split('-');
          if (parts.length === 2) {
            const y = Number(parts[0]);
            const m = Number(parts[1]);
            if (!Number.isNaN(y) && !Number.isNaN(m) && m >= 1 && m <= 12) {
              startOfMonth = new Date(y, m - 1, 1);
              endOfMonth = new Date(y, m, 0, 23, 59, 59, 999);
            }
          }
        }

        const dataCashflow = await db
        .select({
            id: cashflow.id,
            date: cashflow.date,
            type: cashflow.type,
            notes: cashflow.notes,
            amount: cashflow.amount
        }).from(cashflow)
        .where(
            and(
                gte(cashflow.date, startOfMonth),
                lte(cashflow.date, endOfMonth)
            )
        ).orderBy(cashflow.date);

        // Pisahkan data di level aplikasi Next.js
    const dataIncome = dataCashflow.filter(item => item.type === 'INCOME');
    const dataExpense = dataCashflow.filter(item => item.type === 'EXPENSE');

    // 2. Inisialisasi Workbook
    const workbook = new ExcelJs.Workbook();
    
    // Format mata uang Rupiah global
    const formatRupiah = '"Rp"#,##0;("-Rp"#,##0);"-"';

    // =========================================================================
    // TAB 1: SUMMARY (Dibuat paling depan)
    // =========================================================================
    const sheetSummary = workbook.addWorksheet('Dashboard Ringkasan');
    sheetSummary.views = [{ showGridLines: true }]; // Pastikan garis grid muncul

    // Judul Besar Dashboard
    sheetSummary.mergeCells('A1:C1');
    sheetSummary.getCell('A1').value = `LAPORAN KEUANGAN BULAN ${now.toLocaleString('id-ID', { month: "long", year: "numeric"})}`;
    sheetSummary.getCell('A1').font = { bold: true, size: 14, color: { argb: '1E3A8A' } };

    // Header Tabel Ringkasan
    sheetSummary.getRow(3).values = ['Indikator Keuangan', 'Nilai (IDR)', 'Keterangan'];
    sheetSummary.getRow(3).font = { bold: true, color: { argb: 'FFFFFF' } };
    sheetSummary.getRow(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1E3A8A' } };
    sheetSummary.getColumn(1).width = 30;
    sheetSummary.getColumn(2).width = 25;
    sheetSummary.getColumn(3).width = 30;

    // Baris Total Income (Membaca Rumus dari Sheet 'Pemasukan')
    const rowInc = sheetSummary.addRow([
      'Total Pemasukan (Income)', 
      { formula: `SUM(Pemasukan!D2:D${dataIncome.length + 1})` }, 
      'Diambil dari tab Pemasukan'
    ]);
    rowInc.getCell(2).font = { color: { argb: '16A34A' }, bold: true };

    // Baris Total Expense (Membaca Rumus dari Sheet 'Pengeluaran')
    const rowExp = sheetSummary.addRow([
      'Total Pengeluaran (Expense)', 
      { formula: `SUM(Pengeluaran!D2:D${dataExpense.length + 1})` }, 
      'Diambil dari tab Pengeluaran'
    ]);
    rowExp.getCell(2).font = { color: { argb: 'DC2626' }, bold: true };

    // Beri baris kosong pembatas
    sheetSummary.addRow([]);

    // Baris Net Profit Bersih
    const rowNet = sheetSummary.addRow([
      'KEUNTUNGAN BERSIH', 
      { formula: 'B4-B5' }, // Rumus: Total Pemasukan dikurangi Total Pengeluaran di sheet summary
      'Sisa kas / profit bersih'
    ]);
    rowNet.font = { bold: true, size: 11 };
    rowNet.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FEF08A' } }; // Highlight kuning emas

    // Terapkan format Rupiah untuk kolom nilai di Summary
    sheetSummary.getColumn(2).numFmt = formatRupiah;


    // =========================================================================
    // TAB 2: INCOMES (Sheet Pemasukan)
    // =========================================================================
    const sheetIncome = workbook.addWorksheet('Pemasukan');
    sheetIncome.columns = [
      { header: 'No', key: 'no', width: 6 },
      { header: 'Tanggal', key: 'tanggal', width: 16 },
      { header: 'Keterangan Pemasukan', key: 'keterangan', width: 45 },
      { header: 'Jumlah (IDR)', key: 'amount', width: 22 },
    ];
    
    // Style Header Pemasukan (Warna Hijau Melambangkan Uang Masuk)
    const headerInc = sheetIncome.getRow(1);
    headerInc.font = { bold: true, color: { argb: 'FFFFFF' } };
    headerInc.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '15803D' } }; // Green-700
    headerInc.alignment = { horizontal: 'center' };

    dataIncome.forEach((item, index) => {
      sheetIncome.addRow({
        no: index + 1,
        tanggal: formatDate(item.date),
        keterangan: item.notes || '-',
        amount: item.amount,
      }).getCell('no').alignment = { horizontal: 'center' };
    });

    // Baris Total Pemasukan paling bawah di Sheet Pemasukan
    const lastIncRowIndex = dataIncome.length + 2;
    sheetIncome.mergeCells(`A${lastIncRowIndex}:C${lastIncRowIndex}`);
    sheetIncome.getCell(`A${lastIncRowIndex}`).value = 'TOTAL PEMASUKAN';
    sheetIncome.getCell(`A${lastIncRowIndex}`).font = { bold: true };
    sheetIncome.getCell(`A${lastIncRowIndex}`).alignment = { horizontal: 'right' };
    sheetIncome.getCell(`D${lastIncRowIndex}`).value = { formula: `SUM(D2:D${lastIncRowIndex - 1})` };
    sheetIncome.getRow(lastIncRowIndex).font = { bold: true };
    sheetIncome.getColumn('amount').numFmt = formatRupiah;


    // =========================================================================
    // TAB 3: EXPENSES (Sheet Pengeluaran)
    // =========================================================================
    const sheetExpense = workbook.addWorksheet('Pengeluaran');
    sheetExpense.columns = [
      { header: 'No', key: 'no', width: 6 },
      { header: 'Tanggal', key: 'tanggal', width: 16 },
      { header: 'Keterangan Pengeluaran', key: 'keterangan', width: 45 },
      { header: 'Jumlah (IDR)', key: 'amount', width: 22 },
    ];

    // Style Header Pengeluaran (Warna Merah Melambangkan Uang Keluar)
    const headerExp = sheetExpense.getRow(1);
    headerExp.font = { bold: true, color: { argb: 'FFFFFF' } };
    headerExp.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'B91C1C' } }; // Red-700
    headerExp.alignment = { horizontal: 'center' };

    dataExpense.forEach((item, index) => {
      sheetExpense.addRow({
        no: index + 1,
        tanggal: formatDate(item.date),
        keterangan: item.notes || '-',
        amount: item.amount,
      }).getCell('no').alignment = { horizontal: 'center' };
    });

    // Baris Total Pengeluaran paling bawah di Sheet Pengeluaran
    const lastExpRowIndex = dataExpense.length + 2;
    sheetExpense.mergeCells(`A${lastExpRowIndex}:C${lastExpRowIndex}`);
    sheetExpense.getCell(`A${lastExpRowIndex}`).value = 'TOTAL PENGELUARAN';
    sheetExpense.getCell(`A${lastExpRowIndex}`).font = { bold: true };
    sheetExpense.getCell(`A${lastExpRowIndex}`).alignment = { horizontal: 'right' };
    sheetExpense.getCell(`D${lastExpRowIndex}`).value = { formula: `SUM(D2:D${lastExpRowIndex - 1})` };
    sheetExpense.getRow(lastExpRowIndex).font = { bold: true };
    sheetExpense.getColumn('amount').numFmt = formatRupiah;


    // =========================================================================
    // 3. Export File Akhir (.xlsx Buffer)
    // =========================================================================
    const buffer = await workbook.xlsx.writeBuffer();

    const fileMonthLabel = monthParam
      ? new Date(startOfMonth.getFullYear(), startOfMonth.getMonth(), 1).toLocaleString('id-ID', { month: 'long', year: 'numeric' })
      : now.toLocaleString('id-Id', { month: 'long', year: 'numeric' });

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Disposition': `attachment; filename="Laporan_MultiSheet_Cashflow_${fileMonthLabel}.xlsx"`,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });

    } catch (error) {
        console.error('Gagal memproses ekspor Excel : ', error);
        return NextResponse.json({message: 'Internal Server Error'}, { status: 500 });
    }
}