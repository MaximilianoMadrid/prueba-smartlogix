package ms_tracking.repository;

import ms_tracking.entity.TrackingEvento;
import ms_tracking.enums.EventoTracking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrackingRepository extends JpaRepository<TrackingEvento, Long> {
    List<TrackingEvento> findByNumeroSeguimientoOrderByFechaEventoDesc(String numeroSeguimiento);
    List<TrackingEvento> findByEnvioId(Long envioId);
    List<TrackingEvento> findByEvento(EventoTracking evento);
}