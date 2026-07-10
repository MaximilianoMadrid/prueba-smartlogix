package ms_shipping.repository;

import ms_shipping.entity.Envio;
import ms_shipping.enums.EstadoEnvio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EnvioRepository extends JpaRepository<Envio, Long> {
    Optional<Envio> findByNumeroSeguimiento(String numeroSeguimiento);
    List<Envio> findByEmailCliente(String emailCliente);
    List<Envio> findByEstado(EstadoEnvio estado);
    List<Envio> findByPedidoId(Long pedidoId);
}