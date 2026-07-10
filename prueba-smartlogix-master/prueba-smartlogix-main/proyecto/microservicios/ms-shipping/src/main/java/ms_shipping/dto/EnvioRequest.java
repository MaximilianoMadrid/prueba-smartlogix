package ms_shipping.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class EnvioRequest {

    @NotNull(message = "El ID del pedido es obligatorio")
    private Long pedidoId;

    @NotBlank(message = "El email del cliente es obligatorio")
    @Email(message = "Email inválido")
    private String emailCliente;

    @NotBlank(message = "La dirección de destino es obligatoria")
    private String direccionDestino;

    @NotBlank(message = "El carrier es obligatorio")
    private String carrier;

    @NotBlank(message = "El número de seguimiento es obligatorio")
    private String numeroSeguimiento;

    @NotBlank(message = "El tipo de envío es obligatorio")
    private String tipoEnvio;
}