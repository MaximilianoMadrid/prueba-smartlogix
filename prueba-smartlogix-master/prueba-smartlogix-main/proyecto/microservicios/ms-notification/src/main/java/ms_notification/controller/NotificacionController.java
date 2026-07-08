package ms_notification.controller;

import ms_notification.dto.NotificacionRequest;
import ms_notification.dto.NotificacionResponse;
import ms_notification.enums.TipoNotificacion;
import ms_notification.service.NotificacionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notificaciones")
public class NotificacionController {

    private final NotificacionService notificacionService;

    public NotificacionController(NotificacionService notificacionService) {
        this.notificacionService = notificacionService;
    }

    @PostMapping
    public ResponseEntity<NotificacionResponse> crear(
            @Valid @RequestBody NotificacionRequest request) {
        return ResponseEntity.ok(notificacionService.crearNotificacion(request));
    }

    @GetMapping
    public ResponseEntity<List<NotificacionResponse>> obtenerTodas() {
        return ResponseEntity.ok(notificacionService.obtenerTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NotificacionResponse> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(notificacionService.obtenerPorId(id));
    }

    @GetMapping("/destinatario/{email}")
    public ResponseEntity<List<NotificacionResponse>> obtenerPorDestinatario(
            @PathVariable String email) {
        return ResponseEntity.ok(notificacionService.obtenerPorDestinatario(email));
    }

    @GetMapping("/no-leidas/{email}")
    public ResponseEntity<List<NotificacionResponse>> obtenerNoLeidas(
            @PathVariable String email) {
        return ResponseEntity.ok(notificacionService.obtenerNoLeidas(email));
    }

    @GetMapping("/no-leidas/{email}/count")
    public ResponseEntity<Long> contarNoLeidas(@PathVariable String email) {
        return ResponseEntity.ok(notificacionService.contarNoLeidas(email));
    }

    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<NotificacionResponse>> obtenerPorTipo(
            @PathVariable TipoNotificacion tipo) {
        return ResponseEntity.ok(notificacionService.obtenerPorTipo(tipo));
    }

    @PatchMapping("/{id}/leer")
    public ResponseEntity<NotificacionResponse> marcarComoLeida(@PathVariable Long id) {
        return ResponseEntity.ok(notificacionService.marcarComoLeida(id));
    }

    @PatchMapping("/leer-todas/{email}")
    public ResponseEntity<Void> marcarTodasComoLeidas(@PathVariable String email) {
        notificacionService.marcarTodasComoLeidas(email);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        notificacionService.eliminarNotificacion(id);
        return ResponseEntity.noContent().build();
    }
}