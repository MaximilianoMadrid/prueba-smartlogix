package ms_notification.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import ms_notification.enums.TipoNotificacion;

@Data
public class NotificacionRequest {

    @NotBlank(message = "El email del destinatario es obligatorio")
    @Email(message = "Email inválido")
    private String emailDestinatario;

    @NotNull(message = "El tipo de notificación es obligatorio")
    private TipoNotificacion tipo;

    @NotBlank(message = "El título es obligatorio")
    private String titulo;

    @NotBlank(message = "El mensaje es obligatorio")
    private String mensaje;

    @NotBlank(message = "La referencia es obligatoria")
    private String referenciaId;
}