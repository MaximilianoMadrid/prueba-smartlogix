package ms_inventory.service;

import ms_inventory.dto.InventoryRequest;
import ms_inventory.dto.ProductoResponse;
import ms_inventory.entity.Producto;
import ms_inventory.enums.CategoriaProducto;
import ms_inventory.repository.InventarioRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InventarioServiceTest {

    @Mock
    private InventarioRepository inventarioRepository;

    @InjectMocks
    private InventarioService inventarioService;

    @Test
    void debeAgregarProducto() {
        InventoryRequest request = new InventoryRequest();
        request.setSku("SKU-123");
        request.setNombre("Lapicera");
        request.setDescripcion("Lapicera azul");
        request.setCategoria(CategoriaProducto.OTROS);
        request.setCantidadEnStock(50);
        request.setStockMinimo(10);
        request.setPrecio(1.5);
        request.setAlmacen("ALM-1");

        when(inventarioRepository.findBySku("SKU-123"))
                .thenReturn(Optional.empty());

        Producto saved = Producto.builder()
                .id(1L)
                .sku("SKU-123")
                .nombre("Lapicera")
                .descripcion("Lapicera azul")
                .categoria(CategoriaProducto.OTROS)
                .cantidadEnStock(50)
                .stockMinimo(10)
                .precio(1.5)
                .almacen("ALM-1")
                .build();

        when(inventarioRepository.save(any(Producto.class)))
                .thenReturn(saved);

        ProductoResponse resp = inventarioService.agregarProducto(request);

        assertNotNull(resp);
        assertEquals(1L, resp.getId());
        assertEquals("SKU-123", resp.getSku());
        assertEquals("Lapicera", resp.getNombre());

        verify(inventarioRepository).findBySku("SKU-123");
        verify(inventarioRepository).save(any(Producto.class));
    }

    @Test
    void debeLanzarSiSkuExiste() {
        InventoryRequest request = new InventoryRequest();
        request.setSku("SKU-123");

        Producto existing = Producto.builder().id(2L).sku("SKU-123").build();

        when(inventarioRepository.findBySku("SKU-123"))
                .thenReturn(Optional.of(existing));

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> inventarioService.agregarProducto(request));

        assertTrue(ex.getMessage().contains("Ya existe un producto"));
        verify(inventarioRepository).findBySku("SKU-123");
        verify(inventarioRepository, never()).save(any(Producto.class));
    }

    @Test
    void debeActualizarStock() {
        Producto producto = Producto.builder()
                .id(3L)
                .sku("SKU-777")
                .cantidadEnStock(5)
                .stockMinimo(2)
                .build();

        when(inventarioRepository.findById(3L))
                .thenReturn(Optional.of(producto));

        when(inventarioRepository.save(any(Producto.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        var resp = inventarioService.actualizarStock(3L, 20);

        assertEquals(20, resp.getCantidadEnStock());

        verify(inventarioRepository).findById(3L);
        verify(inventarioRepository).save(any(Producto.class));
    }

    @Test
    void debeEliminarProducto() {
        when(inventarioRepository.existsById(5L))
                .thenReturn(true);

        inventarioService.eliminarProducto(5L);

        verify(inventarioRepository).existsById(5L);
        verify(inventarioRepository).deleteById(5L);
    }

    @Test
    void debeLanzarSiNoExisteAlEliminar() {
        when(inventarioRepository.existsById(6L))
                .thenReturn(false);

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> inventarioService.eliminarProducto(6L));

        assertTrue(ex.getMessage().contains("Producto no encontrado"));
        verify(inventarioRepository).existsById(6L);
        verify(inventarioRepository, never()).deleteById(6L);
    }
}
