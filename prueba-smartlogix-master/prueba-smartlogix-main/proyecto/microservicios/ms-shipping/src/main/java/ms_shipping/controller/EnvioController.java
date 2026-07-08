package ms_shipping.controller;

import ms_shipping.dto.EnvioRequest;
import ms_shipping.dto.EnvioResponse;
import ms_shipping.enums.EstadoEnvio;
import ms_shipping.service.EnvioService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/envios")
public class EnvioController {

    private final EnvioService envioService;

    public EnvioController(EnvioService envioService) {
        this.envioService = envioService;
    }

    @PostMapping
    public ResponseEntity<EnvioResponse> crear(@Valid @RequestBody EnvioRequest request) {
        return ResponseEntity.ok(envioService.crearEnvio(request));
    }

    @GetMapping
    public ResponseEntity<List<EnvioResponse>> obtenerTodos() {
        return ResponseEntity.ok(envioService.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EnvioResponse> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(envioService.obtenerPorId(id));
    }

    @GetMapping("/seguimiento/{numero}")
    public ResponseEntity<EnvioResponse> obtenerPorSeguimiento(@PathVariable String numero) {
        return ResponseEntity.ok(envioService.obtenerPorSeguimiento(numero));
    }

    @GetMapping("/cliente/{email}")
    public ResponseEntity<List<EnvioResponse>> obtenerPorCliente(@PathVariable String email) {
        return ResponseEntity.ok(envioService.obtenerPorCliente(email));
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<EnvioResponse>> obtenerPorEstado(@PathVariable EstadoEnvio estado) {
        return ResponseEntity.ok(envioService.obtenerPorEstado(estado));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<EnvioResponse> actualizarEstado(
            @PathVariable Long id,
            @RequestParam EstadoEnvio estado) {
        return ResponseEntity.ok(envioService.actualizarEstado(id, estado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        envioService.eliminarEnvio(id);
        return ResponseEntity.noContent().build();
    }
}