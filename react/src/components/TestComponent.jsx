import { useState, useEffect } from 'react';
import styles from './Test.module.scss';

function ThemeInput({ label, value, onChange }) {
  const handleChange = (e) => {
    onChange(e.target.value)
  };

  return (
    <div className={styles.inputGroup}>
      <label className={styles.inputLabel}>{label}</label>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        className={styles.inputField}
        placeholder={`请输入${label}`}
      />
    </div>
  );
}

function ThemeInput2(props) {
  const { onChange, label } = props;
  const [state, setState] = useState(props?.value || '');

  useEffect(() => {
    console.log('props.value:', props.value);
    setState(props.value);
  }, [props.value]);

  const handleChange = (e) => {
    setState(e.target.value)
    onChange(e.target.value)
  };

  return (
    <div className={styles.inputGroup}>
      <label className={styles.inputLabel}>{label}</label>
      <input
        type="text"
        value={state}
        onChange={handleChange}
        className={styles.inputField}
        placeholder={`请输入${label}`}
      />
    </div>
  );
}

function TestComponent() {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
  });

  const handleFieldChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('表单提交:', formData);
    alert(`表单提交成功！\n标题: ${formData.title}\n作者: ${formData.author}\n分类: ${formData.category}`);
  };

  const handleReset = () => {
    setFormData({
      title: '',
      author: '',
      category: '',
    });
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <ThemeInput
          label="标题"
          value={formData.title}
          onChange={(value) => handleFieldChange('title', value)}
        />

        <ThemeInput2
          label="作者"
          value={formData.author}
          onChange={(value) => handleFieldChange('author', value)}
        />

        <ThemeInput
          label="分类"
          value={formData.category}
          onChange={(value) => handleFieldChange('category', value)}
        />

        <div className={styles.formActions}>
          <button type="submit" className={styles.submitBtn}>
            提交表单
          </button>
          <button type="button" className={styles.resetBtn} onClick={handleReset}>
            重置
          </button>
        </div>
      </form>

      <div className={styles.dataPreview}>
        <h3>实时数据预览</h3>
        <pre className={styles.jsonPreview}>
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default TestComponent;
