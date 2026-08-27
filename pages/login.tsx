import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Login(){
  const router = useRouter()
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [error,setError] = useState('')

  useEffect(()=>{
    if(typeof window === 'undefined') return
    const t = localStorage.getItem('proforma_auth')
    if(t) router.replace('/')
  }, [])

  function submit(e: React.FormEvent){
    e.preventDefault()
    setError('')
    if(email.trim().toLowerCase() === 'proforma@josue.dev' && password === 'Abc@123456'){
      localStorage.setItem('proforma_auth','1')
      router.replace('/')
    } else {
      setError('Invalid credentials')
    }
  }

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#f3f4f6',padding:20}}>
      <div style={{width:420,background:'white',padding:28,borderRadius:8,boxShadow:'0 8px 28px rgba(15,23,42,0.08)'}}>
        <h2 style={{marginTop:0}}>Sign in to Proforma Builder</h2>
        <p className="small">Use your company account to access the proforma generator.</p>
        <form onSubmit={submit} style={{display:'grid',gap:12,marginTop:12}}>
          <div className="field"><label>Email</label><input value={email} onChange={e=>setEmail(e.target.value)} /></div>
          <div className="field"><label>Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
          {error && <div style={{color:'#b91c1c'}}>{error}</div>}
          <div style={{display:'flex',justifyContent:'flex-end'}}>
            <button className="btn" type="submit">Sign in</button>
          </div>
        </form>
      </div>
    </div>
  )
}
