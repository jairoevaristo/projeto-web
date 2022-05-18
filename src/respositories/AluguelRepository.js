const { format, addDays, add } = require("date-fns");
const Aluguel = require("../entities/Aluguel");
const CarRepository = require("./CarRepository");
const UserRepository = require("./UserRepository");

const carRepository = new CarRepository();
const userRespository = new UserRepository();

class AluguelRepository {
  async create({ data_inicio, data_fim, valor_final, pagamento, user, car }) {
    const aluguel = await Aluguel.create({
      data_inicio,
      data_fim,
      valor_final,
      pagamento,
      user,
      car,
    });

    return aluguel;
  }

  async findAll() {
    const aluguel = await Aluguel.find();
    const formatAluguel = [];

    for await (let item of aluguel) {
      const car = await carRepository.findCarById(item.car);
      const user = await userRespository.findUserById(item.user);

      formatAluguel.push({
        id: item._id,
        nome: car.nome,
        quantidade_diarias: this.calcularDiferenca(
          item.data_inicio,
          item.data_fim
        ),
        valor_total: `R$ ${item.valor_final},00`,
        cor: car.cor,
        marca: car.marca,
        data_inicio: format(addDays(item.data_inicio, 1), "dd/MM/yyyy"),
        status: item.status,
        preco_diaria: car.preco_diaria,
        valor: `R$ ${car.valor},00`,
        data_fim: format(addDays(item.data_fim, 1), "dd/MM/yyyy"),
        foto: car.foto,
        id_car: car._id,
        nome_cliente: user.nome,
      });
    }

    return formatAluguel;
  }

  calcularDiferenca(data_inicio, data_fim) {
    let day1 = new Date(data_inicio);
    let day2 = new Date(data_fim);

    let difference = Math.abs(day2 - day1);
    let days = difference / (1000 * 3600 * 24);

    return days;
  }

  async updateStatus(id, { status, id_car }) {
    const aluguel = await Aluguel.findByIdAndUpdate(id, { status });
    const aluguelData = await Aluguel.findById(id);
    const aluguelCar = await Aluguel.findOne().where("car").equals(id_car);

    if (status === "Confirmado") {
      await carRepository.updateCarByIdDate(aluguelCar.car, {
        data_aluguel: Date.parse(aluguelData.data_fim),
      });
      return;
    }

    await carRepository.updateCarByIdDate(aluguelCar.car, {
      data_aluguel: null,
    });
    return aluguel;
  }

  async findAllById(id) {
    const aluguel = await Aluguel.find().where("user").equals(id);
    const formatAluguel = [];

    for await (let item of aluguel) {
      const car = await carRepository.findCarById(item.car);
      const user = await userRespository.findUserById(item.user);

      formatAluguel.push({
        id: item._id,
        nome: car.nome,
        quantidade_diarias: this.calcularDiferenca(
          item.data_inicio,
          item.data_fim
        ),
        valor_total: `R$ ${item.valor_final},00`,
        cor: car.cor,
        marca: car.marca,
        data_inicio: format(addDays(item.data_inicio, 1), "dd/MM/yyyy"),
        status: item.status,
        preco_diaria: car.preco_diaria,
        valor: `R$ ${car.valor},00`,
        data_fim: format(item.data_fim, "dd/MM/yyyy"),
        foto: car.foto,
        nome_cliente: user.nome,
      });
    }

    return formatAluguel;
  }

  async findAllByIdCar(id) {
    const aluguel = await Aluguel.find().where("car").equals(id);
    const formatAluguel = [];

    for await (let item of aluguel) {
      const car = await carRepository.findCarById(item.car);
      const user = await userRespository.findUserById(item.user);

      formatAluguel.push({
        id: item._id,
        nome: car.nome,
        quantidade_diarias: this.calcularDiferenca(
          item.data_inicio,
          item.data_fim
        ),
        valor_total: `R$ ${item.valor_final},00`,
        cor: car.cor,
        marca: car.marca,
        data_inicio: format(addDays(item.data_inicio, 1), "dd/MM/yyyy"),
        status: item.status,
        preco_diaria: car.preco_diaria,
        valor: `R$ ${car.valor},00`,
        data_fim: format(item.data_fim, "dd/MM/yyyy"),
        foto: car.foto,
        nome_cliente: user.nome,
      });
    }

    return formatAluguel;
  }
}

module.exports = AluguelRepository;
