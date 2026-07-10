package ms_shipping.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Manejador global de excepciones.
 *
 * Sin esta clase, cualquier RuntimeException lanzada desde los servicios
 * (por ejemplo "recurso no encontrado") se propaga sin controlar y Spring
 * la traduce en un HTTP 500 con el stacktrace interno expuesto al cliente.
 * Aca la mapeamos a codigos de estado apropiados (404, 400) con un cuerpo
 * de error limpio y consistente en toda la API.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException ex) {
        HttpStatus status = resolveStatus(ex);
        return ResponseEntity.status(status).body(buildBody(status, ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationException(MethodArgumentNotValidException ex) {
        Map<String, String> errores = new LinkedHashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errores.put(error.getField(), error.getDefaultMessage());
        }
        Map<String, Object> body = buildBody(HttpStatus.BAD_REQUEST, "Error de validacion");
        body.put("errores", errores);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        return ResponseEntity.status(status).body(buildBody(status, "Error interno del servidor"));
    }

    /**
     * Heuristica simple: si el mensaje de la excepcion indica que algo
     * "no fue encontrado" o "no existe", respondemos 404; si indica un
     * conflicto (ej. duplicado), respondemos 409; en cualquier otro caso,
     * 400 (peor de los casos para una RuntimeException de negocio, nunca 500).
     */
    private HttpStatus resolveStatus(RuntimeException ex) {
        String mensaje = ex.getMessage() == null ? "" : ex.getMessage().toLowerCase();
        if (mensaje.contains("no encontrad") || mensaje.contains("no existe")) {
            return HttpStatus.NOT_FOUND;
        }
        if (mensaje.contains("ya existe") || mensaje.contains("duplicad")) {
            return HttpStatus.CONFLICT;
        }
        return HttpStatus.BAD_REQUEST;
    }

    private Map<String, Object> buildBody(HttpStatus status, String mensaje) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("mensaje", mensaje);
        return body;
    }
}