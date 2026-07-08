package ms_tracking.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import ms_tracking.enums.EventoTracking;

@Data
public class TrackingRequest {

    @NotBlank(message = "El número de seguimiento es obligatorio")
    private String numeroSeguimiento;

    @NotNull(message = "El ID del envío es obligatorio")
    private Long envioId;

    @NotNull(message = "El evento es obligatorio")
    private EventoTracking evento;

    @NotBlank(message = "La ubicación es obligatoria")
    private String ubicacion;

    @NotBlank(message = "La descripción es obligatoria")
    private String descripcion;
}