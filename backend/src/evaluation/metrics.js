/*
builds 

data class EvaluationMetadataReport(
val modelName: String,
val modelTemperature: Double,
val modelTopP: Double,
val dataset: String,
val totalTestCases: Int,
val defaultEvaluationEndpoint: String,
val totalRepetitions: Int = 1,
val seed: Int? = null,
val timestamp: Timestamp,
)

data class EvaluationReportSummary(
val total: Int,
val passed: Int,
val failed: Int,
val error: Int,
val amountOfRetries: Int? = null,
val precision: Double,
val recall: Double,
val f1Score: Double,
val accuracy: Double,
val totalTruePositives: Int,
val totalFalsePositives: Int,
val totalFalseNegatives: Int,
val totalTrueNegatives: Int
)
data class TestCaseReport(
val testCaseId: Long,
val testCaseName: String? = null,
val datasetId: Long? = null,
val imageSrc: String,
val correctActivityIds: List<String>,
val falsePositiveIds: List<String>,
val falseNegativeIds: List<String>,
val expectedNamesWithIds: List<String>,
val actualNamesWithIds: List<String>,
val isSuccessful: Boolean,
val result: List<ExpectedValue>,
val amountOfRetries: Int? = null
)

*/
