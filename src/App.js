import React, { useState, useEffect } from 'react';
import { Calculator, Plus, Trash2 } from 'lucide-react';

export default function GradeGoal() {
  const emptyAssessment = () => ({ name: '', weight: '', score: '' });
  const emptyModule = () => ({ 
    name: '', 
    weight: '', 
    assessments: [emptyAssessment(), emptyAssessment()]
  });

  const [targetScore, setTargetScore] = useState('70');
  const [year2Weight, setYear2Weight] = useState('40');
  const [year3Weight, setYear3Weight] = useState('60');
  
  const [year2sem1Weight, setYear2Sem1Weight] = useState('50');
  const [year2sem2Weight, setYear2Sem2Weight] = useState('50');
  const [year3sem1Weight, setYear3Sem1Weight] = useState('50');
  const [year3sem2Weight, setYear3Sem2Weight] = useState('50');
  
  const [year2sem1, setYear2Sem1] = useState([emptyModule(), emptyModule(), emptyModule()]);
  const [year2sem2, setYear2Sem2] = useState([emptyModule(), emptyModule(), emptyModule()]);
  const [year3sem1, setYear3Sem1] = useState([emptyModule(), emptyModule(), emptyModule()]);
  const [year3sem2, setYear3Sem2] = useState([emptyModule(), emptyModule(), emptyModule()]);

  // Load data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('gradeGoalData');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setTargetScore(data.targetScore || '70');
        setYear2Weight(data.year2Weight || '40');
        setYear3Weight(data.year3Weight || '60');
        setYear2Sem1Weight(data.year2sem1Weight || '50');
        setYear2Sem2Weight(data.year2sem2Weight || '50');
        setYear3Sem1Weight(data.year3sem1Weight || '50');
        setYear3Sem2Weight(data.year3sem2Weight || '50');
        setYear2Sem1(data.year2sem1 || [emptyModule(), emptyModule(), emptyModule()]);
        setYear2Sem2(data.year2sem2 || [emptyModule(), emptyModule(), emptyModule()]);
        setYear3Sem1(data.year3sem1 || [emptyModule(), emptyModule(), emptyModule()]);
        setYear3Sem2(data.year3sem2 || [emptyModule(), emptyModule(), emptyModule()]);
      } catch (e) {
        console.error('Error loading saved data:', e);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    const data = {
      targetScore,
      year2Weight,
      year3Weight,
      year2sem1Weight,
      year2sem2Weight,
      year3sem1Weight,
      year3sem2Weight,
      year2sem1,
      year2sem2,
      year3sem1,
      year3sem2
    };
    localStorage.setItem('gradeGoalData', JSON.stringify(data));
  }, [targetScore, year2Weight, year3Weight, year2sem1Weight, year2sem2Weight, 
      year3sem1Weight, year3sem2Weight, year2sem1, year2sem2, year3sem1, year3sem2]);

  const updateModule = (setter, modules, moduleIdx, field, value) => {
    const newModules = [...modules];
    newModules[moduleIdx][field] = value;
    setter(newModules);
  };

  const updateAssessment = (setter, modules, moduleIdx, assessmentIdx, field, value) => {
    const newModules = [...modules];
    newModules[moduleIdx].assessments[assessmentIdx][field] = value;
    setter(newModules);
  };

  const addModule = (setter, modules) => {
    setter([...modules, emptyModule()]);
  };

  const removeModule = (setter, modules, moduleIdx) => {
    if (modules.length > 1) {
      setter(modules.filter((_, idx) => idx !== moduleIdx));
    }
  };

  const addAssessment = (setter, modules, moduleIdx) => {
    const newModules = [...modules];
    newModules[moduleIdx].assessments.push(emptyAssessment());
    setter(newModules);
  };

  const removeAssessment = (setter, modules, moduleIdx, assessmentIdx) => {
    const newModules = [...modules];
    if (newModules[moduleIdx].assessments.length > 1) {
      newModules[moduleIdx].assessments = newModules[moduleIdx].assessments.filter((_, idx) => idx !== assessmentIdx);
      setter(newModules);
    }
  };

  const calculateModuleScore = (module) => {
    let totalWeight = 0;
    let weightedScore = 0;
    
    module.assessments.forEach(assessment => {
      const weight = parseFloat(assessment.weight) || 0;
      const score = parseFloat(assessment.score) || 0;
      totalWeight += weight;
      weightedScore += (score * weight / 100);
    });
    
    return totalWeight > 0 ? weightedScore / totalWeight * 100 : 0;
  };

  const getAssessmentWeightTotal = (module) => {
    return module.assessments.reduce((sum, assessment) => sum + (parseFloat(assessment.weight) || 0), 0);
  };

  const calculateSemesterScore = (modules) => {
    let totalWeight = 0;
    let weightedScore = 0;
    
    modules.forEach(module => {
      const moduleWeight = parseFloat(module.weight) || 0;
      const moduleScore = calculateModuleScore(module);
      totalWeight += moduleWeight;
      weightedScore += (moduleScore * moduleWeight / 100);
    });
    
    return totalWeight > 0 ? weightedScore / totalWeight * 100 : 0;
  };

  const getModuleWeightTotal = (modules) => {
    return modules.reduce((sum, module) => sum + (parseFloat(module.weight) || 0), 0);
  };

  const calculateYearScore = (sem1Modules, sem2Modules, sem1Weight, sem2Weight) => {
    const sem1Score = calculateSemesterScore(sem1Modules);
    const sem2Score = calculateSemesterScore(sem2Modules);
    const w1 = parseFloat(sem1Weight) || 0;
    const w2 = parseFloat(sem2Weight) || 0;
    
    if (w1 + w2 === 0) return 0;
    return (sem1Score * w1 + sem2Score * w2) / (w1 + w2);
  };

  const getSemesterWeightTotal = (sem1Weight, sem2Weight) => {
    return (parseFloat(sem1Weight) || 0) + (parseFloat(sem2Weight) || 0);
  };

  const getYearWeightTotal = () => {
    return (parseFloat(year2Weight) || 0) + (parseFloat(year3Weight) || 0);
  };

  const calculateOverallScore = () => {
    const year2Score = calculateYearScore(year2sem1, year2sem2, year2sem1Weight, year2sem2Weight);
    const year3Score = calculateYearScore(year3sem1, year3sem2, year3sem1Weight, year3sem2Weight);
    const w2 = parseFloat(year2Weight) || 0;
    const w3 = parseFloat(year3Weight) || 0;
    
    if (w2 + w3 === 0) return 0;
    return (year2Score * w2 + year3Score * w3) / (w2 + w3);
  };

  const calculateRequiredScore = () => {
    const target = parseFloat(targetScore) || 0;
    const y2w = parseFloat(year2Weight) || 0;
    const y3w = parseFloat(year3Weight) || 0;
    
    const getModuleStats = (module) => {
      let filledWeight = 0;
      let unfilledWeight = 0;
      let filledWeightedScore = 0;
      
      module.assessments.forEach(assessment => {
        const weight = parseFloat(assessment.weight) || 0;
        const score = parseFloat(assessment.score);
        
        if (score !== '' && !isNaN(score)) {
          filledWeight += weight;
          filledWeightedScore += (score * weight / 100);
        } else {
          unfilledWeight += weight;
        }
      });
      
      return { filledWeight, unfilledWeight, filledWeightedScore };
    };
    
    let totalFilledContribution = 0;
    let totalUnfilledWeight = 0;
    
    const allSemesters = [
      { modules: year2sem1, semWeight: parseFloat(year2sem1Weight) || 0, yearWeight: y2w },
      { modules: year2sem2, semWeight: parseFloat(year2sem2Weight) || 0, yearWeight: y2w },
      { modules: year3sem1, semWeight: parseFloat(year3sem1Weight) || 0, yearWeight: y3w },
      { modules: year3sem2, semWeight: parseFloat(year3sem2Weight) || 0, yearWeight: y3w }
    ];
    
    allSemesters.forEach(sem => {
      sem.modules.forEach(module => {
        const moduleWeight = parseFloat(module.weight) || 0;
        const stats = getModuleStats(module);
        const totalAssessmentWeight = stats.filledWeight + stats.unfilledWeight;
        
        if (totalAssessmentWeight > 0 && moduleWeight > 0) {
          const filledModuleScore = (stats.filledWeightedScore / totalAssessmentWeight) * 100;
          const filledProportion = stats.filledWeight / totalAssessmentWeight;
          const filledContribution = filledModuleScore * filledProportion * (moduleWeight / 100) * (sem.semWeight / 100) * (sem.yearWeight / 100);
          totalFilledContribution += filledContribution;
          
          const unfilledProportion = stats.unfilledWeight / totalAssessmentWeight;
          const unfilledWeight = unfilledProportion * (moduleWeight / 100) * (sem.semWeight / 100) * (sem.yearWeight / 100);
          totalUnfilledWeight += unfilledWeight;
        }
      });
    });
    
    if (totalUnfilledWeight === 0) {
      return null;
    }
    
    const requiredAvg = (target - totalFilledContribution) / totalUnfilledWeight;
    return requiredAvg;
  };

  const renderModule = (module, moduleIdx, modules, setter, semesterName) => {
    const moduleScore = calculateModuleScore(module);
    const assessmentWeightTotal = getAssessmentWeightTotal(module);
    const isAssessmentWeightValid = Math.abs(assessmentWeightTotal - 100) < 0.01;

    return (
      <div key={moduleIdx} className="border border-gray-200 rounded-lg p-3 mb-3 bg-gray-50">
        <div className="flex gap-2 items-center mb-2">
          <input
            type="text"
            placeholder="Module name"
            value={module.name}
            onChange={(e) => updateModule(setter, modules, moduleIdx, 'name', e.target.value)}
            className="flex-1 px-2 py-1 border rounded text-sm"
          />
          <input
            type="number"
            placeholder="% of sem"
            value={module.weight}
            onChange={(e) => updateModule(setter, modules, moduleIdx, 'weight', e.target.value)}
            className="w-24 px-2 py-1 border rounded text-sm"
            min="0"
            max="100"
          />
          <button
            onClick={() => removeModule(setter, modules, moduleIdx)}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
            title="Remove module"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="space-y-1 ml-4">
          {module.assessments.map((assessment, assessmentIdx) => (
            <div key={assessmentIdx} className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Assessment name"
                value={assessment.name}
                onChange={(e) => updateAssessment(setter, modules, moduleIdx, assessmentIdx, 'name', e.target.value)}
                className="flex-1 px-2 py-1 border rounded text-xs bg-white"
              />
              <input
                type="number"
                placeholder="% of module"
                value={assessment.weight}
                onChange={(e) => updateAssessment(setter, modules, moduleIdx, assessmentIdx, 'weight', e.target.value)}
                className="w-24 px-2 py-1 border rounded text-xs bg-white"
                min="0"
                max="100"
              />
              <input
                type="number"
                placeholder="Score"
                value={assessment.score}
                onChange={(e) => updateAssessment(setter, modules, moduleIdx, assessmentIdx, 'score', e.target.value)}
                className="w-20 px-2 py-1 border rounded text-xs bg-white"
                min="0"
                max="100"
              />
              <button
                onClick={() => removeAssessment(setter, modules, moduleIdx, assessmentIdx)}
                className="p-1 text-red-600 hover:bg-red-50 rounded"
                title="Remove assessment"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <button
            onClick={() => addAssessment(setter, modules, moduleIdx)}
            className="flex items-center gap-1 px-2 py-1 text-xs text-indigo-600 hover:bg-indigo-50 rounded"
          >
            <Plus size={14} /> Add Assessment
          </button>
        </div>

        <div className="mt-2 text-right">
          <div className="text-xs font-medium text-blue-600">
            Module Score: {moduleScore.toFixed(1)}%
          </div>
          {!isAssessmentWeightValid && (
            <div className="text-xs font-medium text-red-600">
              ⚠ Assessment weights: {assessmentWeightTotal.toFixed(1)}% (should be 100%)
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSemester = (modules, setter, semesterName) => {
    const semScore = calculateSemesterScore(modules);
    const moduleWeightTotal = getModuleWeightTotal(modules);
    const isModuleWeightValid = Math.abs(moduleWeightTotal - 100) < 0.01;

    return (
      <div>
        <h4 className="font-medium text-sm text-gray-700 mb-2">{semesterName}</h4>
        {modules.map((module, idx) => renderModule(module, idx, modules, setter, semesterName))}
        <button
          onClick={() => addModule(setter, modules)}
          className="flex items-center gap-1 px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-50 rounded mb-2"
        >
          <Plus size={16} /> Add Module
        </button>
        <div className="text-right">
          <div className="text-sm font-medium text-blue-600">
            Semester Score: {semScore.toFixed(1)}%
          </div>
          {!isModuleWeightValid && (
            <div className="text-sm font-medium text-red-600">
              ⚠ Module weights: {moduleWeightTotal.toFixed(1)}% (should be 100%)
            </div>
          )}
        </div>
      </div>
    );
  };

  const year2Score = calculateYearScore(year2sem1, year2sem2, year2sem1Weight, year2sem2Weight);
  const year3Score = calculateYearScore(year3sem1, year3sem2, year3sem1Weight, year3sem2Weight);
  const overallScore = calculateOverallScore();
  const target = parseFloat(targetScore) || 0;
  const difference = overallScore - target;
  const requiredScore = calculateRequiredScore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Calculator className="text-indigo-600" size={32} />
          <h1 className="text-3xl font-bold text-gray-800">GradeGoal</h1>
        </div>

        {/* Target and Year Weights */}
        <div className="bg-indigo-50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Overall %</label>
              <input
                type="number"
                value={targetScore}
                onChange={(e) => setTargetScore(e.target.value)}
                className="w-full px-3 py-2 border border-indigo-300 rounded-md"
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year 2 Weight %</label>
              <input
                type="number"
                value={year2Weight}
                onChange={(e) => setYear2Weight(e.target.value)}
                className="w-full px-3 py-2 border border-indigo-300 rounded-md"
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year 3 Weight %</label>
              <input
                type="number"
                value={year3Weight}
                onChange={(e) => setYear3Weight(e.target.value)}
                className="w-full px-3 py-2 border border-indigo-300 rounded-md"
                min="0"
                max="100"
              />
            </div>
          </div>
          {Math.abs(getYearWeightTotal() - 100) >= 0.01 && (
            <div className="mt-3 text-sm font-medium text-red-600">
              ⚠ Year weights total: {getYearWeightTotal()}% (should be 100%)
            </div>
          )}
        </div>

        {/* Year 2 */}
        <div className="border border-gray-300 rounded-lg p-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Year 2</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Semester 1 % of Year</label>
              <input
                type="number"
                value={year2sem1Weight}
                onChange={(e) => setYear2Sem1Weight(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Semester 2 % of Year</label>
              <input
                type="number"
                value={year2sem2Weight}
                onChange={(e) => setYear2Sem2Weight(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                min="0"
                max="100"
              />
            </div>
          </div>
          {Math.abs(getSemesterWeightTotal(year2sem1Weight, year2sem2Weight) - 100) >= 0.01 && (
            <div className="mb-3 text-sm font-medium text-red-600">
              ⚠ Semester weights total: {getSemesterWeightTotal(year2sem1Weight, year2sem2Weight)}% (should be 100%)
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            <div>{renderSemester(year2sem1, setYear2Sem1, 'Semester 1')}</div>
            <div>{renderSemester(year2sem2, setYear2Sem2, 'Semester 2')}</div>
          </div>
          
          <div className="text-right text-lg font-bold text-indigo-600 mt-2">
            Year 2 Score: {year2Score.toFixed(1)}%
          </div>
        </div>

        {/* Year 3 */}
        <div className="border border-gray-300 rounded-lg p-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Year 3</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Semester 1 % of Year</label>
              <input
                type="number"
                value={year3sem1Weight}
                onChange={(e) => setYear3Sem1Weight(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Semester 2 % of Year</label>
              <input
                type="number"
                value={year3sem2Weight}
                onChange={(e) => setYear3Sem2Weight(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                min="0"
                max="100"
              />
            </div>
          </div>
          {Math.abs(getSemesterWeightTotal(year3sem1Weight, year3sem2Weight) - 100) >= 0.01 && (
            <div className="mb-3 text-sm font-medium text-red-600">
              ⚠ Semester weights total: {getSemesterWeightTotal(year3sem1Weight, year3sem2Weight)}% (should be 100%)
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            <div>{renderSemester(year3sem1, setYear3Sem1, 'Semester 1')}</div>
            <div>{renderSemester(year3sem2, setYear3Sem2, 'Semester 2')}</div>
          </div>
          
          <div className="text-right text-lg font-bold text-indigo-600 mt-2">
            Year 3 Score: {year3Score.toFixed(1)}%
          </div>
        </div>

        {/* Overall Results */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Overall Results</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm opacity-90">Current Overall</div>
              <div className="text-3xl font-bold">{overallScore.toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-sm opacity-90">Target</div>
              <div className="text-3xl font-bold">{target}%</div>
            </div>
            <div>
              <div className="text-sm opacity-90">Difference</div>
              <div className={`text-3xl font-bold ${difference >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                {difference >= 0 ? '+' : ''}{difference.toFixed(1)}%
              </div>
            </div>
          </div>
          
          {requiredScore !== null && (
            <div className="mt-6 pt-6 border-t border-white/30">
              <div className="text-center">
                <div className="text-sm opacity-90 mb-2">Required Average on Remaining Assessments</div>
                <div className={`text-4xl font-bold ${requiredScore > 100 ? 'text-red-300' : requiredScore < 0 ? 'text-green-300' : 'text-yellow-300'}`}>
                  {requiredScore.toFixed(1)}%
                </div>
                {requiredScore > 100 && (
                  <div className="text-sm mt-2 text-red-200">
                    ⚠ Target cannot be reached with current scores
                  </div>
                )}
                {requiredScore < 0 && (
                  <div className="text-sm mt-2 text-green-200">
                    ✓ Target already achieved! Any score will maintain it.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
