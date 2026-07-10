package ms_inventory.repository;

import ms_inventory.entity.Producto;
import ms_inventory.enums.CategoriaProducto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface InventarioRepository extends JpaRepository<Producto, Long> {
    Optional<Producto> findBySku(String sku);
    List<Producto> findByCategoria(CategoriaProducto categoria);
    List<Producto> findByAlmacen(String almacen);

    @Query("SELECT p FROM Producto p WHERE p.cantidadEnStock <= p.stockMinimo")
    List<Producto> findProductosConStockBajo();
}