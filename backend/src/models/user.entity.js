import { EntitySchema } from "typeorm";

export const UserEntity = new EntitySchema({
    name: "User",
    tableName: "users",
    columns: {
        id: {
            primary: true,
            type: "uuid",
            generated: "uuid",
        },
        username: {
            type: "varchar",
            nullable: false,
        },
        email: {
            type: "varchar",
            unique: true,
            nullable: false,
        },
        password: {
            type: "varchar",
            nullable: false,
        },
        refreshToken: {
            type: "varchar",
            nullable: true,
        },
    },
});
