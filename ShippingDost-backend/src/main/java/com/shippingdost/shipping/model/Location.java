package com.jumbotail.shipping.model;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Location {
    private double lat;
    private double lng;
}