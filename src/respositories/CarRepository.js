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

  async updateCarById(id, { nome, marca, preco_diaria, valor, cor, avatar }) {
    if (avatar) {
      const saveAvatar = `${
        process.env.DOMAIN_APP
      }/cars/${avatar.filename.replace(" ", "-")}`;

      const carUpdate = await Car.findByIdAndUpdate(id, {
        nome,
        marca,
        preco_diaria,
        valor,
        cor,
        foto: saveAvatar,
      });
      return carUpdate;
    } else {
      const carUpdate = await Car.findByIdAndUpdate(id, {
        nome,
        marca,
        preco_diaria,
        valor,
        cor,
      });
      return carUpdate;
    }
  }
}

module.exports = CarRepository;
