package ms_notification.repository;

import ms_notification.entity.Notificacion;
import ms_notification.enums.TipoNotificacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificacionRepository extends JpaRepository<Notificacion, Long> {
    List<Notificacion> findByEmailDestinatarioOrderByCreadaEnDesc(String emailDestinatario);
    List<Notificacion> findByEmailDestinatarioAndLeida(String emailDestinatario, boolean leida);
    List<Notificacion> findByTipo(TipoNotificacion tipo);
    long countByEmailDestinatarioAndLeida(String emailDestinatario, boolean leida);
}