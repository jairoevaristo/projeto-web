const Car = require("../entities/Car");

class CarRepository {
  async create({ nome, marca, valor, preco_diaria, cor, foto }) {
    const cars = await Car.create({
      nome,
      marca,
      valor,
      preco_diaria,
      cor,
      foto,
    });

    return cars;
  }

  async findCarById(id) {
    const admin = await Car.findById(id);
    return admin;
  }

  async findAll() {
    const cars = await Car.find();
    return cars;
  }

  async findAllCarDisponiveis() {
    const cars = await Car.find().where("status").equals("DISPONÍVEL");
    return cars;
  }
}

module.exports = CarRepository;
