package ms_inventory.service;

import ms_inventory.dto.ProductoRequest;
import ms_inventory.dto.ProductoResponse;
import ms_inventory.entity.Producto;
import ms_inventory.enums.CategoriaProducto;
import ms_inventory.repository.InventarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InventarioService {

    private final InventarioRepository inventarioRepository;

    public InventarioService(InventarioRepository inventarioRepository) {
        this.inventarioRepository = inventarioRepository;
    }

    public ProductoResponse agregarProducto(ProductoRequest request) {
        if (inventarioRepository.findBySku(request.getSku()).isPresent()) {
            throw new RuntimeException("Ya existe un producto con SKU: " + request.getSku());
        }
        Producto producto = Producto.builder()
                .sku(request.getSku())
                .nombre(request.getNombre())
                .descripcion(request.getDescripcion())
                .categoria(request.getCategoria())
                .cantidadEnStock(request.getCantidadEnStock())
                .stockMinimo(request.getStockMinimo())
                .precio(request.getPrecio())
                .almacen(request.getAlmacen())
                .build();
        return toResponse(inventarioRepository.save(producto));
    }

    public List<ProductoResponse> obtenerTodos() {
        return inventarioRepository.findAll()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ProductoResponse obtenerPorId(Long id) {
        return toResponse(inventarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + id)));
    }

    public ProductoResponse obtenerPorSku(String sku) {
        return toResponse(inventarioRepository.findBySku(sku)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con SKU: " + sku)));
    }

    public List<ProductoResponse> obtenerPorCategoria(CategoriaProducto categoria) {
        return inventarioRepository.findByCategoria(categoria)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<ProductoResponse> obtenerStockBajo() {
        return inventarioRepository.findProductosConStockBajo()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ProductoResponse actualizarStock(Long id, Integer nuevaCantidad) {
        Producto producto = inventarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + id));
        producto.setCantidadEnStock(nuevaCantidad);
        return toResponse(inventarioRepository.save(producto));
    }

    public ProductoResponse actualizarProducto(Long id, ProductoRequest request) {
        Producto producto = inventarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + id));
        producto.setNombre(request.getNombre());
        producto.setDescripcion(request.getDescripcion());
        producto.setCategoria(request.getCategoria());
        producto.setCantidadEnStock(request.getCantidadEnStock());
        producto.setStockMinimo(request.getStockMinimo());
        producto.setPrecio(request.getPrecio());
        producto.setAlmacen(request.getAlmacen());
        return toResponse(inventarioRepository.save(producto));
    }

    public void eliminarProducto(Long id) {
        if (!inventarioRepository.existsById(id)) {
            throw new RuntimeException("Producto no encontrado con id: " + id);
        }
        inventarioRepository.deleteById(id);
    }

    private ProductoResponse toResponse(Producto p) {
        return ProductoResponse.builder()
                .id(p.getId())
                .sku(p.getSku())
                .nombre(p.getNombre())
                .descripcion(p.getDescripcion())
                .categoria(p.getCategoria())
                .cantidadEnStock(p.getCantidadEnStock())
                .stockMinimo(p.getStockMinimo())
                .precio(p.getPrecio())
                .almacen(p.getAlmacen())
                .stockBajo(p.getCantidadEnStock() <= p.getStockMinimo())
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }
}