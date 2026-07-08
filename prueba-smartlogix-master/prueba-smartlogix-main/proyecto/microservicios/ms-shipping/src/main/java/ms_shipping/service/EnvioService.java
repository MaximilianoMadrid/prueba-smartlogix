package ms_shipping.service;

import ms_shipping.dto.EnvioRequest;
import ms_shipping.dto.EnvioResponse;
import ms_shipping.entity.Envio;
import ms_shipping.enums.EstadoEnvio;
import ms_shipping.repository.EnvioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EnvioService {

    private final EnvioRepository envioRepository;

    public EnvioService(EnvioRepository envioRepository) {
        this.envioRepository = envioRepository;
    }

    public EnvioResponse crearEnvio(EnvioRequest request) {
        if (envioRepository.findByNumeroSeguimiento(request.getNumeroSeguimiento()).isPresent()) {
            throw new RuntimeException("Ya existe un envío con número de seguimiento: "
                    + request.getNumeroSeguimiento());
        }
        Envio envio = Envio.builder()
                .pedidoId(request.getPedidoId())
                .emailCliente(request.getEmailCliente())
                .direccionDestino(request.getDireccionDestino())
                .carrier(request.getCarrier())
                .numeroSeguimiento(request.getNumeroSeguimiento())
                .tipoEnvio(request.getTipoEnvio())
                .estado(EstadoEnvio.PREPARANDO)
                .build();
        return toResponse(envioRepository.save(envio));
    }

    public List<EnvioResponse> obtenerTodos() {
        return envioRepository.findAll()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public EnvioResponse obtenerPorId(Long id) {
        return toResponse(envioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Envío no encontrado con id: " + id)));
    }

    public EnvioResponse obtenerPorSeguimiento(String numeroSeguimiento) {
        return toResponse(envioRepository.findByNumeroSeguimiento(numeroSeguimiento)
                .orElseThrow(() -> new RuntimeException(
                        "Envío no encontrado con número de seguimiento: " + numeroSeguimiento)));
    }

    public List<EnvioResponse> obtenerPorCliente(String emailCliente) {
        return envioRepository.findByEmailCliente(emailCliente)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<EnvioResponse> obtenerPorEstado(EstadoEnvio estado) {
        return envioRepository.findByEstado(estado)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public EnvioResponse actualizarEstado(Long id, EstadoEnvio nuevoEstado) {
        Envio envio = envioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Envío no encontrado con id: " + id));
        envio.setEstado(nuevoEstado);
        return toResponse(envioRepository.save(envio));
    }

    public void eliminarEnvio(Long id) {
        if (!envioRepository.existsById(id)) {
            throw new RuntimeException("Envío no encontrado con id: " + id);
        }
        envioRepository.deleteById(id);
    }

    private EnvioResponse toResponse(Envio e) {
        return EnvioResponse.builder()
                .id(e.getId())
                .pedidoId(e.getPedidoId())
                .emailCliente(e.getEmailCliente())
                .direccionDestino(e.getDireccionDestino())
                .carrier(e.getCarrier())
                .numeroSeguimiento(e.getNumeroSeguimiento())
                .estado(e.getEstado())
                .tipoEnvio(e.getTipoEnvio())
                .createdAt(e.getCreatedAt())
                .updatedAt(e.getUpdatedAt())
                .build();
    }
}