package com.kli.backend.representation;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/representation")
public class RepresentationController {

    private final RepresentationService service;

    public RepresentationController(RepresentationService service) {
        this.service = service;
    }

    @GetMapping
    public PeriodSpecFrequency getSpecFrequencyByPeriod(@RequestParam("period") int period) {
        return service.getSpecFrequencyByPeriod(period);
    }

}
