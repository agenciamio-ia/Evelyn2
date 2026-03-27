function doPost(e) {
  // Configurar cabeceras CORS para permitir peticiones desde cualquier origen
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  try {
    // Obtener la hoja de cálculo activa
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parsear los datos enviados desde el frontend
    // Usamos e.postData.contents porque enviaremos los datos como text/plain para evitar problemas de preflight CORS
    var data = JSON.parse(e.postData.contents);
    
    // Preparar los datos para la fila
    var timestamp = new Date();
    var giftId = data.giftId;
    var giftName = data.giftName;
    var guestName = data.guestName;
    var guestPhone = data.guestPhone;
    
    // Añadir una nueva fila con los datos
    sheet.appendRow([timestamp, giftId, giftName, guestName, guestPhone]);
    
    // Retornar respuesta de éxito
    return ContentService.createTextOutput(JSON.stringify({
      "status": "success", 
      "message": "Reserva confirmada exitosamente"
    })).setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Retornar respuesta de error
    return ContentService.createTextOutput(JSON.stringify({
      "status": "error", 
      "message": error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Manejar peticiones OPTIONS (Preflight)
function doOptions(e) {
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.JSON);
}
