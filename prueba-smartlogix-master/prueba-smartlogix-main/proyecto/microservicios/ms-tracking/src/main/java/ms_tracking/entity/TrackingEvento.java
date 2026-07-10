package ms_tracking.entity;

import ms_tracking.enums.EventoTracking;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tracking_eventos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrackingEvento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String numeroSeguimiento;

    @Column(nullable = false)
    private Long envioId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventoTracking evento;

    @Column(nullable = false)
    private String ubicacion;

    @Column(nullable = false)
    private String descripcion;

    @Column(updatable = false)
    private LocalDateTime fechaEvento;

    @PrePersist
    protected void onCreate() {
        fechaEvento = LocalDateTime.now();
    }
}