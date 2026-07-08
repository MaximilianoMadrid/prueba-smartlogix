package ms_shipping.dto;

import lombok.Builder;
import lombok.Data;
import ms_shipping.enums.EstadoEnvio;
import java.time.LocalDateTime;

@Data
@Builder
public class EnvioResponse {
    private Long id;
    private Long pedidoId;
    private String emailCliente;
    private String direccionDestino;
    private String carrier;
    private String numeroSeguimiento;
    private EstadoEnvio estado;
    private String tipoEnvio;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}