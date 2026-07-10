package ms_notification.dto;

import lombok.Builder;
import lombok.Data;
import ms_notification.enums.TipoNotificacion;
import java.time.LocalDateTime;

@Data
@Builder
public class NotificacionResponse {
    private Long id;
    private String emailDestinatario;
    private TipoNotificacion tipo;
    private String titulo;
    private String mensaje;
    private String referenciaId;
    private boolean leida;
    private LocalDateTime creadaEn;
    private LocalDateTime leidaEn;
}