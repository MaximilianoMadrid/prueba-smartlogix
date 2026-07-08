package ms_notification.entity;

import ms_notification.enums.TipoNotificacion;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notificaciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String emailDestinatario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoNotificacion tipo;

    @Column(nullable = false)
    private String titulo;

    @Column(nullable = false, length = 1000)
    private String mensaje;

    @Column(nullable = false)
    private String referenciaId; // ID del pedido, envío, etc.

    @Column(nullable = false)
    private boolean leida;

    @Column(updatable = false)
    private LocalDateTime creadaEn;

    private LocalDateTime leidaEn;

    @PrePersist
    protected void onCreate() {
        creadaEn = LocalDateTime.now();
        leida = false;
    }
}