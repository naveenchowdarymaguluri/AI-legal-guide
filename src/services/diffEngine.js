class DiffEngine {
  compareDocuments(docAId, docBId) {
    // Default pre-computed high fidelity legal comparison
    return {
      versionA: {
        id: docAId || "doc-1",
        title: "Employment Agreement v1.0 (Original)",
        filename: "Employment_Agreement_v1.0_Draft.pdf",
        uploadedAt: "Sep 10, 2026",
        pages: 24,
        size: "1.4 MB",
        hash: "8f9ba12c...base"
      },
      versionB: {
        id: docBId || "doc-2",
        title: "Employment Agreement v2.4 (Executive Revision)",
        filename: "Employment_Agreement_v2.4_Clean.pdf",
        uploadedAt: "Sep 21, 2026",
        pages: 26,
        size: "1.6 MB",
        hash: "e44d91aa...rev"
      },
      stats: {
        additions: 14,
        deletions: 8,
        modifications: 6,
        netRiskShift: "-18% (Risk Mitigated)",
        similarity: 91.4
      },
      diffClauses: [
        {
          section: "Section 8.2",
          title: "Notice Period on Termination Without Cause",
          type: "modified",
          riskDelta: "Favorable to Executive",
          original: "Either party may terminate this Agreement without cause upon sixty (60) days prior written notice. Company may elect to place Executive on paid garden leave.",
          revised: "Either party may terminate this Agreement without cause upon thirty (30) days prior written notice. Upon notice, Company may elect to pay base salary in lieu of notice or place Executive on paid garden leave.",
          explanation: "Notice window reduced from 60 days to 30 days. Added explicit 'pay in lieu of notice' clause allowing rapid executive departure."
        },
        {
          section: "Section 12.1",
          title: "Indemnification & Third-Party Defense",
          type: "modified",
          riskDelta: "Significant Risk Reduction",
          original: "Executive agrees to indemnify, defend, and hold harmless Company from all third-party claims arising from Executive's performance of duties.",
          revised: "Company shall indemnify, defend, and hold harmless Executive to the maximum extent permitted under California Labor Code § 2802 and Delaware General Corporation Law § 145 against all third-party proceedings.",
          explanation: "Shifted unilateral employee indemnification (void under CA law) to full corporate indemnification backed by statutory references."
        },
        {
          section: "Section 14.3",
          title: "Post-Termination Non-Compete",
          type: "deleted",
          riskDelta: "Statutory Compliance Fixed",
          original: "For a period of twelve (12) months following termination, Executive shall not engage in any competing enterprise within North America.",
          revised: "*(Clause deleted in its entirety pursuant to Cal. Bus. & Prof. Code § 16600)*",
          explanation: "Entire non-compete covenant removed to comply with California SB 699 and avoid statutory civil penalties."
        },
        {
          section: "Section 16.5",
          title: "Jury Trial Waiver & Mandatory Arbitration",
          type: "added",
          riskDelta: "Procedural Change",
          original: "*(Not present in Version 1.0)*",
          revised: "Any controversy or claim arising out of this Agreement shall be settled by confidential arbitration administered by JAMS in San Francisco, California under its Comprehensive Arbitration Rules.",
          explanation: "Introduced bilateral JAMS arbitration clause with statutory discovery protections."
        }
      ]
    };
  }
}

module.exports = new DiffEngine();
