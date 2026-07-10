package ms_shipping.service;

import ms_shipping.dto.EnvioRequest;
import ms_shipping.dto.EnvioResponse;
import ms_shipping.entity.Envio;
import ms_shipping.enums.EstadoEnvio;
import ms_shipping.repository.EnvioRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EnvioServiceTest {

    @Mock
    private EnvioRepository envioRepository;

    @InjectMocks
    private EnvioService envioService;

    @Test
    void debeCrearEnvio() {
        EnvioRequest request = new EnvioRequest();
        request.setPedidoId(100L);
        request.setEmailCliente("cliente@test.com");
        request.setDireccionDestino("Calle Falsa 123");
        request.setCarrier("DHL");
        request.setNumeroSeguimiento("TRACK-123");
        request.setTipoEnvio("AEREO");

        when(envioRepository.findByNumeroSeguimiento("TRACK-123"))
                .thenReturn(Optional.empty());

        Envio saved = Envio.builder()
                .id(1L)
                .pedidoId(100L)
                .emailCliente("cliente@test.com")
                .direccionDestino("Calle Falsa 123")
                .carrier("DHL")
                .numeroSeguimiento("TRACK-123")
                .estado(EstadoEnvio.PREPARANDO)
                .tipoEnvio("AEREO")
                .build();

        when(envioRepository.save(any(Envio.class)))
                .thenReturn(saved);

        EnvioResponse resp = envioService.crearEnvio(request);

        assertNotNull(resp);
        assertEquals(1L, resp.getId());
        assertEquals("TRACK-123", resp.getNumeroSeguimiento());
        assertEquals(EstadoEnvio.PREPARANDO, resp.getEstado());

        verify(envioRepository).findByNumeroSeguimiento("TRACK-123");
        verify(envioRepository).save(any(Envio.class));
    }

    @Test
    void debeLanzarSiTrackingDuplicado() {
        EnvioRequest request = new EnvioRequest();
        request.setNumeroSeguimiento("TRACK-123");

        Envio existing = Envio.builder().id(2L).numeroSeguimiento("TRACK-123").build();

        when(envioRepository.findByNumeroSeguimiento("TRACK-123"))
                .thenReturn(Optional.of(existing));

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> envioService.crearEnvio(request));

        assertTrue(ex.getMessage().contains("Ya existe un envío"));
        verify(envioRepository).findByNumeroSeguimiento("TRACK-123");
        verify(envioRepository, never()).save(any(Envio.class));
    }

    @Test
    void debeObtenerPorIdYActualizarEstado() {
        Envio envio = Envio.builder()
                .id(3L)
                .pedidoId(200L)
                .numeroSeguimiento("T-200")
                .estado(EstadoEnvio.PREPARANDO)
                .build();

        when(envioRepository.findById(3L))
                .thenReturn(Optional.of(envio));

        when(envioRepository.save(any(Envio.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        var resp = envioService.actualizarEstado(3L, EstadoEnvio.EN_TRANSITO);

        assertEquals(EstadoEnvio.EN_TRANSITO, resp.getEstado());

        verify(envioRepository).findById(3L);
        verify(envioRepository).save(any(Envio.class));
    }

    @Test
    void debeEliminarEnvio() {
        when(envioRepository.existsById(5L)).thenReturn(true);

        envioService.eliminarEnvio(5L);

        verify(envioRepository).existsById(5L);
        verify(envioRepository).deleteById(5L);
    }

    @Test
    void debeLanzarSiNoExisteAlEliminar() {
        when(envioRepository.existsById(6L)).thenReturn(false);

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> envioService.eliminarEnvio(6L));

        assertTrue(ex.getMessage().contains("Envío no encontrado"));
        verify(envioRepository).existsById(6L);
        verify(envioRepository, never()).deleteById(6L);
    }
}
