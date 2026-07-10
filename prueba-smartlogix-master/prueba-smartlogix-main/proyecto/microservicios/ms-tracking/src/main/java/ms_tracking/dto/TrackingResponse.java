package ms_tracking.dto;

import lombok.Builder;
import lombok.Data;
import ms_tracking.enums.EventoTracking;
import java.time.LocalDateTime;

@Data
@Builder
public class TrackingResponse {
    private Long id;
    private String numeroSeguimiento;
    private Long envioId;
    private EventoTracking evento;
    private String ubicacion;
    private String descripcion;
    private LocalDateTime fechaEvento;
}