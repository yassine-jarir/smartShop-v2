package com.smartshopV1.service;

import com.smartshopV1.dto.codepromo.CodePromoRequestDTO;
import com.smartshopV1.dto.codepromo.CodePromoResponseDTO;
import java.util.List;

public interface CodePromoService {
    CodePromoResponseDTO createCodePromo(CodePromoRequestDTO dto);
    CodePromoResponseDTO getCodePromoById(Long id);
    CodePromoResponseDTO getCodePromoByCode(String code);
    List<CodePromoResponseDTO> getAllCodePromos();
    CodePromoResponseDTO updateCodePromo(Long id, CodePromoRequestDTO dto);
    void deleteCodePromo(Long id);
}
