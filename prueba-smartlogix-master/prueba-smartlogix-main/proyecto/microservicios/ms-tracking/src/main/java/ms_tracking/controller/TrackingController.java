package ms_tracking.controller;

import ms_tracking.dto.TrackingRequest;
import ms_tracking.dto.TrackingResponse;
import ms_tracking.service.TrackingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tracking")
public class TrackingController {

    private final TrackingService trackingService;

    public TrackingController(TrackingService trackingService) {
        this.trackingService = trackingService;
    }

    @PostMapping
    public ResponseEntity<TrackingResponse> registrar(@Valid @RequestBody TrackingRequest request) {
        return ResponseEntity.ok(trackingService.registrarEvento(request));
    }

    @GetMapping
    public ResponseEntity<List<TrackingResponse>> obtenerTodos() {
        return ResponseEntity.ok(trackingService.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrackingResponse> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(trackingService.obtenerPorId(id));
    }

    @GetMapping("/seguimiento/{numero}")
    public ResponseEntity<List<TrackingResponse>> obtenerHistorial(@PathVariable String numero) {
        return ResponseEntity.ok(trackingService.obtenerHistorial(numero));
    }

    @GetMapping("/envio/{envioId}")
    public ResponseEntity<List<TrackingResponse>> obtenerPorEnvio(@PathVariable Long envioId) {
        return ResponseEntity.ok(trackingService.obtenerPorEnvio(envioId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        trackingService.eliminarEvento(id);
        return ResponseEntity.noContent().build();
    }
}