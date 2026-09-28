package com.hamarashops.contact.service;

import com.hamarashops.contact.model.AppointmentRequest;
import com.hamarashops.contact.model.ContactInquiryRequest;

public interface ResendEmailService {
    String sendInquiryEmail(ContactInquiryRequest request);
    String sendAppointmentEmail(AppointmentRequest request);
}

