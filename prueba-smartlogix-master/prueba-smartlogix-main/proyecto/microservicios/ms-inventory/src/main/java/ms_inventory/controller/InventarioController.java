package ms_inventory.controller;

import ms_inventory.dto.ProductoRequest;
import ms_inventory.dto.ProductoResponse;
import ms_inventory.enums.CategoriaProducto;
import ms_inventory.service.InventarioService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventario")
public class InventarioController {

    private final InventarioService inventarioService;

    public InventarioController(InventarioService inventarioService) {
        this.inventarioService = inventarioService;
    }

    @PostMapping
    public ResponseEntity<ProductoResponse> agregar(@Valid @RequestBody ProductoRequest request) {
        return ResponseEntity.ok(inventarioService.agregarProducto(request));
    }

    @GetMapping
    public ResponseEntity<List<ProductoResponse>> obtenerTodos() {
        return ResponseEntity.ok(inventarioService.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoResponse> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(inventarioService.obtenerPorId(id));
    }

    @GetMapping("/sku/{sku}")
    public ResponseEntity<ProductoResponse> obtenerPorSku(@PathVariable String sku) {
        return ResponseEntity.ok(inventarioService.obtenerPorSku(sku));
    }

    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<ProductoResponse>> obtenerPorCategoria(
            @PathVariable CategoriaProducto categoria) {
        return ResponseEntity.ok(inventarioService.obtenerPorCategoria(categoria));
    }

    @GetMapping("/stock-bajo")
    public ResponseEntity<List<ProductoResponse>> obtenerStockBajo() {
        return ResponseEntity.ok(inventarioService.obtenerStockBajo());
    }

    @PatchMapping("/{id}/stock")
    public ResponseEntity<ProductoResponse> actualizarStock(
            @PathVariable Long id,
            @RequestParam Integer cantidad) {
        return ResponseEntity.ok(inventarioService.actualizarStock(id, cantidad));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductoResponse> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody ProductoRequest request) {
        return ResponseEntity.ok(inventarioService.actualizarProducto(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        inventarioService.eliminarProducto(id);
        return ResponseEntity.noContent().build();
    }
}