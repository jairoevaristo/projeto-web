const { format, addDays } = require("date-fns");
const Car = require("../entities/Car");
const Aluguel = require("../entities/Aluguel");

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
    const cars = await Car.findById(id);
    return cars;
  }

  async findAll() {
    const cars = await Car.find();

    const carsFormat = cars.map((item) => {
      return {
        _id: item._id,
        cor: item.cor,
        data_aluguel: format(item.data_aluguel || Date.now(), "dd/MM/yyyy"),
        nome: item.nome,
        foto: item.foto,
        valor: item.valor,
        marca: item.marca,
        preco_diaria: item.preco_diaria,
        data_disponivel:
          item.data_aluguel >= Date.now()
            ? format(addDays(item.data_aluguel, 1), "dd/MM/yyyy")
            : "",
        status:
          Date.parse(item.data_aluguel) >= Date.now()
            ? "INDISPONÍVEL"
            : "DISPONÍVEL",
      };
    });

    return carsFormat;
  }

  async findAllCarDisponiveis() {
    const cars = await Car.find();
    const carsFilter = cars.filter(
      (item) =>
        item.data_aluguel <= new Date().toISOString(Date.now()) ||
        !item.data_aluguel
    );

    console.log("ds");

    return carsFilter;
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

  async updateCarByIdDate(id, { data_aluguel }) {
    const carUpdate = await Car.findByIdAndUpdate(id, {
      data_aluguel,
    });

    return carUpdate;
  }

  async removeCar(id) {
    const aluguel = await Aluguel.find().where("car").equals(id);

    if (aluguel.length > 0) {
      return { message: "Este carro já está alugado" };
    }

    await Car.findByIdAndDelete(id);
    return { message: "" };
  }
}

module.exports = CarRepository;
