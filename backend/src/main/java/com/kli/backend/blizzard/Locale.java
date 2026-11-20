package com.kli.backend.blizzard;

public enum Locale {
    EN_US("en_US"),
    ES_MX("es_MX"),
    PT_BR("pt_BR"),
    DE_DE("de_DE"),
    EN_GB("en_GB"),
    ES_ES("es_ES"),
    FR_FR("fr_FR"),
    IT_IT("it_IT"),
    RU_RU("ru_RU"),
    KO_KR("ko_KR"),
    ZH_TW("zh_TW"),
    ZH_CN("zh_CN");

    private final String locale;

    Locale(String value) {
        this.locale = value;
    }

    @Override
    public String toString() {
        return locale;
    }
}
