const formatDate = (fecha) => {
  const newDate = new Date(fecha);
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    //hour: 'numeric',
    //minute: 'numeric',
  };

  return newDate.toLocaleDateString('es-ES', options);
};
module.exports = { formatDate };
