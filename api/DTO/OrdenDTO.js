import { formatDate } from '../../utils/index.js'

export const OrdenDTO = (orden) => {
  let total = 0;
  orden.productos.forEach((pro) => {
    const suma = pro.cantidad * pro.precio;
    total += suma;
  })
  return {
    ...orden,
    time: formatDate(new Date()),
    total: total
  }
};