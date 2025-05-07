const MAX_HISTORY = 5; // Número de mensajes de contexto a recordar

// Mapa de historial por canal
const canalHistorial = new Map();

/**
 * Añade un mensaje al historial de un canal.
 * @param {string} canalId - ID del canal.
 * @param {string} mensaje - Contenido del mensaje.
 */
function agregarMensaje(canalId, mensaje) {
  if (!canalHistorial.has(canalId)) {
    canalHistorial.set(canalId, []);
  }

  const historial = canalHistorial.get(canalId);
  historial.push(mensaje);

  if (historial.length > MAX_HISTORY) {
    historial.shift(); // Elimina el mensaje más antiguo
  }

  canalHistorial.set(canalId, historial);
}

/**
 * Obtiene el historial de mensajes del canal como contexto.
 * @param {string} canalId - ID del canal.
 * @returns {string} - Contexto concatenado.
 */
function obtenerContexto(canalId) {
  if (!canalHistorial.has(canalId)) return '';
  return canalHistorial.get(canalId).join('\n');
}

module.exports = {
  agregarMensaje,
  obtenerContexto
};
