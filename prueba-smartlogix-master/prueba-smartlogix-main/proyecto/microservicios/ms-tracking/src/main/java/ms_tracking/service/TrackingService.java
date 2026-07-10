package ms_tracking.service;

import ms_tracking.dto.TrackingRequest;
import ms_tracking.dto.TrackingResponse;
import ms_tracking.entity.TrackingEvento;
import ms_tracking.enums.EventoTracking;
import ms_tracking.repository.TrackingRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TrackingService {

    private final TrackingRepository trackingRepository;

    public TrackingService(TrackingRepository trackingRepository) {
        this.trackingRepository = trackingRepository;
    }

    public TrackingResponse registrarEvento(TrackingRequest request) {
        TrackingEvento evento = TrackingEvento.builder()
                .numeroSeguimiento(request.getNumeroSeguimiento())
                .envioId(request.getEnvioId())
                .evento(request.getEvento())
                .ubicacion(request.getUbicacion())
                .descripcion(request.getDescripcion())
                .build();
        return toResponse(trackingRepository.save(evento));
    }

    public List<TrackingResponse> obtenerHistorial(String numeroSeguimiento) {
        return trackingRepository
                .findByNumeroSeguimientoOrderByFechaEventoDesc(numeroSeguimiento)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<TrackingResponse> obtenerPorEnvio(Long envioId) {
        return trackingRepository.findByEnvioId(envioId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<TrackingResponse> obtenerTodos() {
        return trackingRepository.findAll()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public TrackingResponse obtenerPorId(Long id) {
        return toResponse(trackingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado con id: " + id)));
    }

    public void eliminarEvento(Long id) {
        if (!trackingRepository.existsById(id)) {
            throw new RuntimeException("Evento no encontrado con id: " + id);
        }
        trackingRepository.deleteById(id);
    }

    private TrackingResponse toResponse(TrackingEvento e) {
        return TrackingResponse.builder()
                .id(e.getId())
                .numeroSeguimiento(e.getNumeroSeguimiento())
                .envioId(e.getEnvioId())
                .evento(e.getEvento())
                .ubicacion(e.getUbicacion())
                .descripcion(e.getDescripcion())
                .fechaEvento(e.getFechaEvento())
                .build();
    }
}