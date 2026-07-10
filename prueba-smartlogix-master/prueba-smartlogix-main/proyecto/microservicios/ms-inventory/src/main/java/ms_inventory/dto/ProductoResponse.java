package ms_inventory.dto;

import lombok.Builder;
import lombok.Data;
import ms_inventory.enums.CategoriaProducto;
import java.time.LocalDateTime;

@Data
@Builder
public class ProductoResponse {
    private Long id;
    private String sku;
    private String nombre;
    private String descripcion;
    private CategoriaProducto categoria;
    private Integer cantidadEnStock;
    private Integer stockMinimo;
    private Double precio;
    private String almacen;
    private boolean stockBajo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}