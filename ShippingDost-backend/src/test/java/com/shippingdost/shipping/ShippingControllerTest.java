package com.shippingdost.shipping;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

// IMPORTANT: Static imports for CSRF bypass
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest
@AutoConfigureMockMvc
class ShippingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser // Bypasses 401 Unauthorized
    @DisplayName("API: Should return 200 OK for valid calculation request")
    void testCalculateEndpoint() throws Exception {
        String jsonRequest = "{\"customerId\":1, \"sellerId\":1, \"productId\":1, \"deliverySpeed\":\"standard\"}";

        mockMvc.perform(post("/api/v1/shipping-charge/calculate")
                .with(csrf()) // <--- FIXES 403 FORBIDDEN ERROR
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonRequest))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.transportMode").exists());
    }

    @Test
    @WithMockUser
    @DisplayName("API: Should return 200 OK for master data fetch")
    void testGetSellers() throws Exception {
        mockMvc.perform(get("/api/v1/sellers"))
                .andExpect(status().isOk());
    }
}