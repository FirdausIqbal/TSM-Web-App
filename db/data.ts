
/* 
    * Data Seeding *
    app_user
    cars
    rentals
    
    access by : domain/seed

*/

export const userSeed = [
    {
        username : "admin123",
        password : "admin123",
        role : "ADMIN"
    },
    {
        username : "user1234",
        password : "user1234",
        role : "USER"
    }
] as const

export const carSeed = [
    {
        name: "Xpander Cross",
        plateNumber: "B 1020",
        pricePerDay: 550000,
    },
    {
        name: "Xpander Ultimate",
        plateNumber: "B 1144",
        pricePerDay: 550000,
    },
    {
        name: "Xpander Sport",
        plateNumber: "B 5421",
        pricePerDay: 550000,
    },
    {
        name: "Fortuner",
        plateNumber: "B 9999",
        pricePerDay: 1000000,
    },
    {
        name: "Avanza",
        plateNumber: "D 5413",
        pricePerDay: 400000,
    },
    {
        name: "Brio",
        plateNumber: "Z 9841",
        pricePerDay: 350000,
    },
] as const;

export const customerSeed = [
    {
        name: "Iqbal",
        nik: "123456789",
        phone: "0812457548",
    },
    {
        name: "John",
        nik: "987654321",
        phone: "0812457778",
    },
]
