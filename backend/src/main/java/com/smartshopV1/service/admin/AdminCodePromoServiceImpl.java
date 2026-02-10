package com.smartshopV1.service.admin;

import com.smartshopV1.dto.codepromo.CodePromoRequestDTO;
import com.smartshopV1.dto.codepromo.CodePromoResponseDTO;
import com.smartshopV1.entity.CodePromo;
import com.smartshopV1.mapper.CodePromoMapper;
import com.smartshopV1.repository.CodePromoRepository;
import com.smartshopV1.service.CodePromoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminCodePromoServiceImpl implements CodePromoService {

    private final CodePromoRepository codePromoRepository;
    private final CodePromoMapper codePromoMapper;

    @Override
    public CodePromoResponseDTO createCodePromo(CodePromoRequestDTO dto) {
        CodePromo codePromo = codePromoMapper.toEntity(dto);
        CodePromo saved = codePromoRepository.save(codePromo);
        return codePromoMapper.toResponseDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public CodePromoResponseDTO getCodePromoById(Long id) {
        CodePromo codePromo = codePromoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CodePromo not found"));
        return codePromoMapper.toResponseDTO(codePromo);
    }

    @Override
    @Transactional(readOnly = true)
    public CodePromoResponseDTO getCodePromoByCode(String code) {
        CodePromo codePromo = codePromoRepository.findAll().stream()
                .filter(cp -> code.equalsIgnoreCase(cp.getCode()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("CodePromo not found"));
        return codePromoMapper.toResponseDTO(codePromo);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CodePromoResponseDTO> getAllCodePromos() {
        return codePromoRepository.findAll().stream()
                .map(codePromoMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CodePromoResponseDTO updateCodePromo(Long id, CodePromoRequestDTO dto) {
        CodePromo codePromo = codePromoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CodePromo not found"));
        codePromoMapper.updateEntity(dto, codePromo);
        CodePromo updated = codePromoRepository.save(codePromo);
        return codePromoMapper.toResponseDTO(updated);
    }

    @Override
    public void deleteCodePromo(Long id) {
        if (!codePromoRepository.existsById(id)) {
            throw new RuntimeException("CodePromo not found");
        }
        codePromoRepository.deleteById(id);
    }
}

