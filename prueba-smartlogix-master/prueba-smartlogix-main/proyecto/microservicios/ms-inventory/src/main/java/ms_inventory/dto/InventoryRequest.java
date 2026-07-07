package ms_inventory.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import ms_inventory.enums.CategoriaProducto;

@Data
public class InventoryRequest {

    @NotBlank(message = "El SKU es obligatorio")
    private String sku;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "La descripción es obligatoria")
    private String descripcion;

    @NotNull(message = "La categoría es obligatoria")
    private CategoriaProducto categoria;

    @NotNull(message = "La cantidad en stock es obligatoria")
    @Min(value = 0, message = "El stock no puede ser negativo")
    private Integer cantidadEnStock;

    @NotNull(message = "El stock mínimo es obligatorio")
    @Min(value = 0, message = "El stock mínimo no puede ser negativo")
    private Integer stockMinimo;

    @NotNull(message = "El precio es obligatorio")
    @Positive(message = "El precio debe ser positivo")
    private Double precio;

    @NotBlank(message = "El almacén es obligatorio")
    private String almacen;
}