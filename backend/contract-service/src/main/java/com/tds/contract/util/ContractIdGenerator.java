package com.tds.contract.util;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;

/**
 * 数字合约唯一标识码生成器 (47位)
 * 严格遵循 TC609-6-2025-14 附录 C.1
 * 构成：
 * 1. 类型码 (1位) - 'C' 代表 Contract
 * 2. 业务节点类型码 (1位) - '1' 代表 区域节点, '2' 代表 行业节点, '3' 代表 企业节点
 * 3. 业务节点主体标识码 (18位) - 对应社会信用代码或NDI标识
 * 4. 业务节点区域/行业代码 (4位)
 * 5. 时间码 (14位) - YYYYMMDDHHmmss
 * 6. 随机码 (8位)
 * 7. 校验码 (1位)
 */
public class ContractIdGenerator {

    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
    private static final Random RANDOM = new Random();

    public static String generate(String nodeType, String subjectId, String areaCode) {
        StringBuilder sb = new StringBuilder();
        
        // 1. 类型码
        sb.append("C");
        
        // 2. 业务节点类型码
        sb.append(nodeType != null ? nodeType : "3");
        
        // 3. 业务节点主体标识码 (18位)
        String sId = String.format("%-18s", subjectId != null ? subjectId : "000000000000000000").replace(' ', '0');
        sb.append(sId.substring(0, 18));
        
        // 4. 业务节点区域/行业代码 (4位)
        String aCode = String.format("%-4s", areaCode != null ? areaCode : "0000").replace(' ', '0');
        sb.append(aCode.substring(0, 4));
        
        // 5. 时间码 (14位)
        sb.append(LocalDateTime.now().format(TIME_FORMATTER));
        
        // 6. 随机码 (8位)
        for (int i = 0; i < 8; i++) {
            sb.append(RANDOM.nextInt(10));
        }
        
        // 7. 校验码 (1位) - 简单取模
        int sum = 0;
        for (int i = 0; i < sb.length(); i++) {
            sum += sb.charAt(i);
        }
        sb.append(sum % 10);
        
        return sb.toString();
    }
}
