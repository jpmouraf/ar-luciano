-- CreateTable
CREATE TABLE `InteligenciaWasi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pacienteNome` VARCHAR(191) NOT NULL,
    `qiVerbalPontuacao` INTEGER NOT NULL,
    `qiVerbalIntervaloMin` INTEGER NOT NULL,
    `qiVerbalIntervaloMax` INTEGER NOT NULL,
    `qiVerbalPercentil` INTEGER NOT NULL,
    `qiVerbalClassificacao` VARCHAR(191) NOT NULL,
    `qiExecPontuacao` INTEGER NOT NULL,
    `qiExecIntervaloMin` INTEGER NOT NULL,
    `qiExecIntervaloMax` INTEGER NOT NULL,
    `qiExecPercentil` INTEGER NOT NULL,
    `qiExecClassificacao` VARCHAR(191) NOT NULL,
    `qiTotalPontuacao` INTEGER NOT NULL,
    `qiTotalIntervaloMin` INTEGER NOT NULL,
    `qiTotalIntervaloMax` INTEGER NOT NULL,
    `qiTotalPercentil` INTEGER NOT NULL,
    `qiTotalClassificacao` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
