// src/seeds/001-initial.js
exports.seed = function (knex) {
  return knex("tblPY1").insert([
    {
      username: "admin",
      password: "$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.",
      role: "admin",
      name: "Emir TP",
      phone: "4444",
      bloodType: "A+",
    },
  ]);
};
