package ms_notification.service;

import ms_notification.dto.NotificacionRequest;
import ms_notification.dto.NotificacionResponse;
import ms_notification.entity.Notificacion;
import ms_notification.enums.TipoNotificacion;
import ms_notification.repository.NotificacionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificacionService {

    private final NotificacionRepository notificacionRepository;

    public NotificacionService(NotificacionRepository notificacionRepository) {
        this.notificacionRepository = notificacionRepository;
    }

    public NotificacionResponse crearNotificacion(NotificacionRequest request) {
        Notificacion notificacion = Notificacion.builder()
                .emailDestinatario(request.getEmailDestinatario())
                .tipo(request.getTipo())
                .titulo(request.getTitulo())
                .mensaje(request.getMensaje())
                .referenciaId(request.getReferenciaId())
                .build();
        return toResponse(notificacionRepository.save(notificacion));
    }

    public List<NotificacionResponse> obtenerTodas() {
        return notificacionRepository.findAll()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public NotificacionResponse obtenerPorId(Long id) {
        return toResponse(notificacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notificación no encontrada con id: " + id)));
    }

    public List<NotificacionResponse> obtenerPorDestinatario(String email) {
        return notificacionRepository
                .findByEmailDestinatarioOrderByCreadaEnDesc(email)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<NotificacionResponse> obtenerNoLeidas(String email) {
        return notificacionRepository
                .findByEmailDestinatarioAndLeida(email, false)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<NotificacionResponse> obtenerPorTipo(TipoNotificacion tipo) {
        return notificacionRepository.findByTipo(tipo)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public long contarNoLeidas(String email) {
        return notificacionRepository.countByEmailDestinatarioAndLeida(email, false);
    }

    public NotificacionResponse marcarComoLeida(Long id) {
        Notificacion notificacion = notificacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notificación no encontrada con id: " + id));
        notificacion.setLeida(true);
        notificacion.setLeidaEn(LocalDateTime.now());
        return toResponse(notificacionRepository.save(notificacion));
    }

    public void marcarTodasComoLeidas(String email) {
        List<Notificacion> noLeidas = notificacionRepository
                .findByEmailDestinatarioAndLeida(email, false);
        noLeidas.forEach(n -> {
            n.setLeida(true);
            n.setLeidaEn(LocalDateTime.now());
        });
        notificacionRepository.saveAll(noLeidas);
    }

    public void eliminarNotificacion(Long id) {
        if (!notificacionRepository.existsById(id)) {
            throw new RuntimeException("Notificación no encontrada con id: " + id);
        }
        notificacionRepository.deleteById(id);
    }

    private NotificacionResponse toResponse(Notificacion n) {
        return NotificacionResponse.builder()
                .id(n.getId())
                .emailDestinatario(n.getEmailDestinatario())
                .tipo(n.getTipo())
                .titulo(n.getTitulo())
                .mensaje(n.getMensaje())
                .referenciaId(n.getReferenciaId())
                .leida(n.isLeida())
                .creadaEn(n.getCreadaEn())
                .leidaEn(n.getLeidaEn())
                .build();
    }
}