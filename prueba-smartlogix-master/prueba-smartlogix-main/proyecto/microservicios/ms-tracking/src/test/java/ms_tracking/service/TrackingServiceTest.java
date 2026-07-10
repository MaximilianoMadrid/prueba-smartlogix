package ms_tracking.service;

import ms_tracking.dto.TrackingRequest;
import ms_tracking.dto.TrackingResponse;
import ms_tracking.entity.TrackingEvento;
import ms_tracking.enums.EventoTracking;
import ms_tracking.repository.TrackingRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TrackingServiceTest {

    @Mock
    private TrackingRepository trackingRepository;

    @InjectMocks
    private TrackingService trackingService;

    @Test
    void debeRegistrarEvento() {
        TrackingRequest req = new TrackingRequest();
        req.setNumeroSeguimiento("T-100");
        req.setEnvioId(10L);
        req.setEvento(EventoTracking.EN_CAMINO);
        req.setUbicacion("CDMX");
        req.setDescripcion("Salida de bodega");

        TrackingEvento saved = TrackingEvento.builder()
                .id(1L)
                .numeroSeguimiento("T-100")
                .envioId(10L)
                .evento(EventoTracking.EN_CAMINO)
                .ubicacion("CDMX")
                .descripcion("Salida de bodega")
                .build();

        when(trackingRepository.save(any(TrackingEvento.class)))
                .thenReturn(saved);

        TrackingResponse resp = trackingService.registrarEvento(req);

        assertNotNull(resp);
        assertEquals(1L, resp.getId());
        assertEquals("T-100", resp.getNumeroSeguimiento());

        verify(trackingRepository).save(any(TrackingEvento.class));
    }

    @Test
    void debeObtenerHistorialYPorEnvio() {
        TrackingEvento e = TrackingEvento.builder()
                .id(2L)
                .numeroSeguimiento("T-200")
                .envioId(20L)
                .evento(EventoTracking.DESPACHADO)
                .ubicacion("GDL")
                .descripcion("Envío despachado")
                .build();

        when(trackingRepository.findByNumeroSeguimientoOrderByFechaEventoDesc("T-200"))
                .thenReturn(java.util.List.of(e));

        when(trackingRepository.findByEnvioId(20L))
                .thenReturn(java.util.List.of(e));

        var historial = trackingService.obtenerHistorial("T-200");
        var porEnvio = trackingService.obtenerPorEnvio(20L);

        assertEquals(1, historial.size());
        assertEquals(1, porEnvio.size());

        verify(trackingRepository).findByNumeroSeguimientoOrderByFechaEventoDesc("T-200");
        verify(trackingRepository).findByEnvioId(20L);
    }

    @Test
    void debeObtenerPorIdYEliminar() {
        TrackingEvento e = TrackingEvento.builder()
                .id(3L)
                .numeroSeguimiento("T-300")
                .envioId(30L)
                .evento(EventoTracking.ENTREGADO)
                .ubicacion("MTY")
                .descripcion("Entregado")
                .build();

        when(trackingRepository.findById(3L))
                .thenReturn(Optional.of(e));

        when(trackingRepository.existsById(3L))
                .thenReturn(true);

        var resp = trackingService.obtenerPorId(3L);

        assertEquals(3L, resp.getId());

        trackingService.eliminarEvento(3L);

        verify(trackingRepository).findById(3L);
        verify(trackingRepository).existsById(3L);
        verify(trackingRepository).deleteById(3L);
    }

    @Test
    void debeLanzarSiNoExisteAlObtenerOEliminar() {
        when(trackingRepository.findById(99L)).thenReturn(Optional.empty());
        when(trackingRepository.existsById(100L)).thenReturn(false);

        RuntimeException ex1 = assertThrows(RuntimeException.class,
                () -> trackingService.obtenerPorId(99L));

        RuntimeException ex2 = assertThrows(RuntimeException.class,
                () -> trackingService.eliminarEvento(100L));

        assertTrue(ex1.getMessage().contains("Evento no encontrado"));
        assertTrue(ex2.getMessage().contains("Evento no encontrado"));
    }
}
