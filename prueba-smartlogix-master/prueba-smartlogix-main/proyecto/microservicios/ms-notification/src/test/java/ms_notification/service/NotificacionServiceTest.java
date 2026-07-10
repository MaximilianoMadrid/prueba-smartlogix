package ms_notification.service;

import ms_notification.dto.NotificacionRequest;
import ms_notification.dto.NotificacionResponse;
import ms_notification.entity.Notificacion;
import ms_notification.enums.TipoNotificacion;
import ms_notification.repository.NotificacionRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificacionServiceTest {

    @Mock
    private NotificacionRepository notificacionRepository;

    @InjectMocks
    private NotificacionService notificacionService;

    @Test
    void debeCrearNotificacion() {
        NotificacionRequest req = new NotificacionRequest();
        req.setEmailDestinatario("user@test.com");
        req.setTipo(TipoNotificacion.PEDIDO_CREADO);
        req.setTitulo("Pedido recibido");
        req.setMensaje("Tu pedido se ha creado");
        req.setReferenciaId("ORD-1");

        Notificacion saved = Notificacion.builder()
                .id(1L)
                .emailDestinatario("user@test.com")
                .tipo(TipoNotificacion.PEDIDO_CREADO)
                .titulo("Pedido recibido")
                .mensaje("Tu pedido se ha creado")
                .referenciaId("ORD-1")
                .leida(false)
                .build();

        when(notificacionRepository.save(any(Notificacion.class)))
                .thenReturn(saved);

        NotificacionResponse resp = notificacionService.crearNotificacion(req);

        assertNotNull(resp);
        assertEquals(1L, resp.getId());
        assertEquals("user@test.com", resp.getEmailDestinatario());

        verify(notificacionRepository).save(any(Notificacion.class));
    }

    @Test
    void debeContarYObtenerNoLeidas() {
        Notificacion n = Notificacion.builder()
                .id(2L)
                .emailDestinatario("user@test.com")
                .leida(false)
                .tipo(TipoNotificacion.STOCK_BAJO)
                .titulo("Stock").mensaje("Bajo").referenciaId("SKU-1")
                .build();

        when(notificacionRepository.countByEmailDestinatarioAndLeida("user@test.com", false))
                .thenReturn(1L);

        when(notificacionRepository.findByEmailDestinatarioAndLeida("user@test.com", false))
                .thenReturn(java.util.List.of(n));

        long count = notificacionService.contarNoLeidas("user@test.com");
        var noLeidas = notificacionService.obtenerNoLeidas("user@test.com");

        assertEquals(1L, count);
        assertEquals(1, noLeidas.size());

        verify(notificacionRepository).countByEmailDestinatarioAndLeida("user@test.com", false);
        verify(notificacionRepository).findByEmailDestinatarioAndLeida("user@test.com", false);
    }

    @Test
    void debeMarcarComoLeidaYMarcarTodas() {
        Notificacion n = Notificacion.builder()
                .id(3L)
                .emailDestinatario("user2@test.com")
                .leida(false)
                .tipo(TipoNotificacion.ENVIO_DESPACHADO)
                .titulo("Envío").mensaje("Despachado").referenciaId("ENV-1")
                .build();

        when(notificacionRepository.findById(3L)).thenReturn(Optional.of(n));
        when(notificacionRepository.save(any(Notificacion.class))).thenAnswer(i -> i.getArgument(0));

        var resp = notificacionService.marcarComoLeida(3L);

        assertTrue(resp.isLeida());

        when(notificacionRepository.findByEmailDestinatarioAndLeida("user2@test.com", false))
                .thenReturn(java.util.List.of(n));

        notificacionService.marcarTodasComoLeidas("user2@test.com");

        verify(notificacionRepository).findById(3L);
        verify(notificacionRepository).save(any(Notificacion.class));
        verify(notificacionRepository).findByEmailDestinatarioAndLeida("user2@test.com", false);
        verify(notificacionRepository).saveAll(anyList());
    }

    @Test
    void debeEliminarYLanzarSiNoExiste() {
        when(notificacionRepository.existsById(5L)).thenReturn(true);

        notificacionService.eliminarNotificacion(5L);

        verify(notificacionRepository).existsById(5L);
        verify(notificacionRepository).deleteById(5L);

        when(notificacionRepository.existsById(6L)).thenReturn(false);

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> notificacionService.eliminarNotificacion(6L));

        assertTrue(ex.getMessage().contains("Notificación no encontrada"));
    }
}
