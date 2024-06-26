package com.rp.expenseapi.dto.limit;

import java.math.BigDecimal;
import java.time.YearMonth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ExpenseLimitDTO {
    private Long id;
    private BigDecimal value ;
    private YearMonth date;
}
